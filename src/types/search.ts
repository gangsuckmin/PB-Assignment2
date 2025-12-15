export type SearchOptions = {
    originalLanguage:
        | "장르 (전체)"
        | "Action"
        | "Adventure"
        | "Comedy"
        | "Crime"
        | "Family";
    translationLanguage:
        | "평점 (전체)"
        | "9~10"
        | "8~9"
        | "7~8"
        | "6~7"
        | "5~6"
        | "4~5"
        | "4점 이하";
    sorting: "언어 (전체)" | "영어" | "한국어";
};