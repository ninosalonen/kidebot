use serde_json::Value;

fn clean_string(s: &str) -> String {
    s.replace("\r\n", "")
        .replace(['\n', '\"', '“', ' ', '”'], "")
}

/*
    Removes all unwanted characters from the input arguments.
    Splits multiple tokens separated by a comma into a vec of tokens.
*/
pub fn input_parse(
    token: String,
    url: String,
    str_include: String,
    str_exclude: String,
    get_max: bool,
) -> (Vec<String>, String, String, String, bool) {
    let tokens = clean_string(&token)
        .split(',')
        .map(|slice| slice.to_string())
        .collect::<Vec<String>>();
    let url = clean_string(&url);
    let str_include = clean_string(&str_include).to_lowercase();
    let str_exclude = clean_string(&str_exclude).to_lowercase();
    (tokens, url, str_include, str_exclude, get_max)
}

/*
    Removes all unwanted ticket types from variants using str_include and str_exclude.
    If new filtered_variants is empty, return all variants without any filters.
*/
pub fn parse_variants(
    variants: Vec<Value>,
    str_include: String,
    str_exclude: String,
) -> Vec<Value> {
    let include_words = match &str_include {
        str if !str.is_empty() => str.rsplit(',').collect::<Vec<&str>>(),
        _ => vec![""],
    };

    let exclude_words = match &str_exclude {
        str if !str.is_empty() => str.rsplit(',').collect::<Vec<&str>>(),
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

    if !new_variants.is_empty() {
        return new_variants;
    }
    old_variants
}
