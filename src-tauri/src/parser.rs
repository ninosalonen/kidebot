use serde_json::Value;

fn clean_string(s: &str) -> String {
    s.replace("\r\n", "")
        .replace("\n", "")
        .replace("\"", "")
        .replace("“", "")
        .replace(" ", "")
        .replace("”", "")
}

pub fn input_parse(
    token: String,
    url: String,
    str_include: String,
    str_exclude: String,
    get_max: bool,
) -> (Vec<String>, String, String, String, bool) {
    let tokens = clean_string(&token)
        .split(",")
        .map(|slice| slice.to_string())
        .collect::<Vec<String>>();
    let url = clean_string(&url);
    let str_include = clean_string(&str_include).to_lowercase();
    let str_exclude = clean_string(&str_exclude).to_lowercase();
    (tokens, url, str_include, str_exclude, get_max)
}

pub fn parse_variants(
    variants: Vec<Value>,
    str_include: String,
    str_exclude: String,
) -> Vec<Value> {
    let include_words = match &str_include {
        str if str.len() > 0 => str.rsplit(",").collect::<Vec<&str>>(),
        _ => vec![""],
    };

    let exclude_words = match &str_exclude {
        str if str.len() > 0 => str.rsplit(",").collect::<Vec<&str>>(),
        _ => vec![],
    };

    let old_variants = variants.clone();

    let new_variants: Vec<Value> = variants
        .into_iter()
        .filter(|variant| {
            include_words
                .iter()
                .any(|word| variant["name"].to_string().to_lowercase().contains(word))
        })
        .filter(|variant| {
            !exclude_words
                .iter()
                .any(|word| variant["name"].to_string().to_lowercase().contains(word))
        })
        .collect::<Vec<Value>>();

    if new_variants.len() > 0 {
        return new_variants;
    }
    return old_variants;
}
