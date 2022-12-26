#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod parser;
mod tickets;

#[tauri::command]
async fn main_tickets(
    token: String,
    url: String,
    str_include: String,
    str_exclude: String,
    get_max: bool,
) -> String {
    /* Clean the input */
    let (tokens, url, str_include, str_exclude, get_max) =
        parser::input_parse(token, url, str_include, str_exclude, get_max);

    /* Wait for the sales to start */
    let variants = tickets::wait_for_variants(url).await;

    /* Sales started */
    match variants {
        Ok(serde_json::Value::Null) => String::from("Event URL on aika varmasti väärin..."),
        Ok(serde_json::Value::String(s)) => s,
        Ok(serde_json::Value::Array(arr)) => {
            /* Remove all unwanted ticket types from variants if there are any */
            let parsed_variants = parser::parse_variants(arr, str_include, str_exclude);

            /* Try to get every ticket listed in parsed_variants for every token */
            let response = tickets::get_tickets(tokens, parsed_variants, get_max).await;
            match response {
                Ok(res) => res,
                Err(err) => err.to_string(),
            }
        }
        _ => String::from("Jokin meni vikaan, epäile kaikkea."),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![main_tickets])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
