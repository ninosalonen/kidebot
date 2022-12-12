use futures::future::join_all;
use reqwest::header::{HeaderMap, CONTENT_TYPE};
use reqwest::{Client, StatusCode};
use serde_json::Value;

async fn fetch_variants(api_url: &str) -> Result<Value, reqwest::Error> {
    let body_as_string = reqwest::get(api_url).await?.text().await?;
    let event = serde_json::from_str(&body_as_string);

    let body: Value = event.unwrap_or(Value::Null);
    let body = match body {
        Value::Object(obj) => {
            if !obj.contains_key("model") {
                return Ok(serde_json::json!(
                    "Ei tapahtumaa olemassa kyseisellä URL-osoitteella."
                ));
            }
            obj
        }
        _ => return Ok(Value::Null),
    };

    let variants = body["model"]["variants"].clone();
    Ok(variants)
}

pub async fn wait_for_variants(url: String) -> Result<Value, reqwest::Error> {
    if !url.starts_with("https://kide.app") {
        return Ok(Value::String(
            "Tarkista, että URL on muodossa: https://kide.app/events/[id]".to_string(),
        ));
    }

    let event_id = url.rsplit('/').next();

    let api_url = match event_id {
        Some(id) if id.len() == 36 => format!("https://api.kide.app/api/products/{}", id),
        _ => return Ok(Value::Null),
    };

    for _ in 0..200 {
        let variants = fetch_variants(&api_url).await?;
        match &variants {
            Value::Array(arr) => {
                if arr.len() > 0 {
                    return Ok(variants);
                }
            }
            Value::String(str) => return Ok(serde_json::json!(str.to_string())),
            _ => (),
        }
    }
    Ok(Value::String(
        "Lipunmyynti ei ikinä alkanut tai se on loppunut jo.".to_string(),
    ))
}

async fn get_ticket(
    variant: &Value,
    get_max: bool,
    token: &String,
    client: &Client,
    headers: &HeaderMap,
) -> Result<String, reqwest::Error> {
    let max_quantity = variant["productVariantMaximumReservableQuantity"].clone();
    let inventory_id = variant["inventoryId"].clone();
    let amount: Value = if get_max {
        max_quantity
    } else {
        serde_json::json!(1)
    };

    let body = serde_json::json!({
        "toCreate": [{
            "inventoryId": inventory_id,
            "quantity": amount,
            "productVariantUserForm": serde_json::json!(()),
        }],
        "toCancel": []
    });

    let res = client
        .post("https://api.kide.app/api/reservations")
        .bearer_auth(&token)
        .headers(headers.clone())
        .body(body.to_string())
        .send()
        .await?;

    match res.status() {
        StatusCode::OK => {
            return Ok(format!(
                "{} kpl {} saatu. (Tokenin loppu {}).\r\n",
                amount,
                variant["name"],
                &token[token.len() - 5..]
            ));
        }
        _ => {
            return Ok("".to_string());
        }
    };
}

pub async fn get_tickets(
    tokens: Vec<String>,
    parsed_variants: Vec<Value>,
    get_max: bool,
) -> Result<String, reqwest::Error> {
    let client = reqwest::Client::new();
    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, "application/json".parse().unwrap());

    let mut response_string = String::from("");
    let mut requests = vec![];

    for variant in &parsed_variants {
        for token in &tokens {
            let request = get_ticket(variant, get_max, token, &client, &headers);
            requests.push(request)
        }
    }

    let results = join_all(requests).await;
    for result in results {
        match result {
            Ok(res) => response_string.push_str(&res),
            _ => (),
        }
    }

    Ok(response_string)
}
