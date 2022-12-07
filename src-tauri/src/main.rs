#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::thread;

#[tauri::command]
fn get_tickets(token: &str, url: &str, include: &str, exclude: &str, get_max: bool) -> String {
    thread::sleep_ms(5000);
    format!(
        "Token: {}, Url: {}, Include: {}, Exclude: {}, Max tickets: {}",
        token, url, include, exclude, get_max
    )
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_tickets])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
