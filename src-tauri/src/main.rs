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
    let (tokens, url, str_include, str_exclude, get_max) =
        parser::input_parse(token, url, str_include, str_exclude, get_max);
    let variants = tickets::wait_for_variants(url).await;
    match variants {
        Ok(serde_json::Value::Null) => return String::from("Event URL on aika varmasti väärin..."),
        Ok(serde_json::Value::Array(arr)) => {
            let parsed_variants = parser::parse_variants(arr, &str_include, &str_exclude);
            let response = tickets::get_tickets(tokens, parsed_variants, get_max).await;
            match response {
                Ok(res) => return String::from(res),
                Err(err) => return String::from(err.to_string()),
            }
        }
        _ => return String::from("Jokin meni vikaan..."),
    }
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![main_tickets])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
