use reqwest::header::{HeaderMap, CONTENT_TYPE};
use serde_json::Value;

async fn fetch_variants(api_url: &str) -> Result<Value, reqwest::Error> {
    let body_as_string = reqwest::get(api_url).await?.text().await?;
    let event = serde_json::from_str(&body_as_string);

    let body: Value = match event {
        Ok(result) => result,
        Err(_) => return Ok(serde_json::json!([])),
    };

    let variants = body["model"]["variants"].clone();
    Ok(variants)
}

pub async fn wait_for_variants(url: String) -> Result<Value, reqwest::Error> {
    if !url.starts_with("https://kide.app/events") {
        return Ok(Value::Null);
    }
    let event_id = url.rsplit('/').next().unwrap();
    if event_id.len() < 30 {
        return Ok(Value::Null);
    }
    let api_url = format!("https://api.kide.app/api/products/{}", event_id);

    for _ in 1..500 {
        let variants = fetch_variants(&api_url).await?;
        match &variants {
            Value::Array(arr) => {
                if arr.len() > 0 {
                    return Ok(variants);
                }
            }
            _ => (),
        }
    }
    Ok(Value::Null)
}

pub async fn get_tickets(
    tokens: Vec<String>,
    parsed_variants: Vec<Value>,
    get_max: bool,
) -> Result<String, reqwest::Error> {
    let client = reqwest::Client::new();
    let mut headers = HeaderMap::new();
    headers.insert(CONTENT_TYPE, "application/json".parse().unwrap());

    for variant in parsed_variants {
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
            .bearer_auth(tokens[0].clone())
            .headers(headers.clone())
            .body(body.to_string())
            .send()
            .await?;
        if res.status() != 200 {
            return Ok("Jokin meni pieleen. Tarkista että tokenisi on oikein.".to_string());
        }
    }

    Ok("Liput hankittu!".to_string())
}
