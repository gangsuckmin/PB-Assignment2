import { useMemo, useState } from "react";
import "./MovieSearch.css";
import type { SearchOptions } from "../../types/search";

type DropdownKey = "originalLanguage" | "translationLanguage" | "sorting";

type Props = {
    onChangeOptions: (options: SearchOptions) => void;
};

export default function MovieSearch({ onChangeOptions }: Props) {
    const dropdowns: Record<DropdownKey, string[]> = useMemo(
        () => ({
            originalLanguage: ["장르 (전체)", "Action", "Adventure", "Comedy", "Crime", "Family"],
            translationLanguage: ["평점 (전체)", "9~10", "8~9", "7~8", "6~7", "5~6", "4~5", "4점 이하"],
            sorting: ["언어 (전체)", "영어", "한국어"],
        }),
        []
    );

    const DEFAULT_OPTIONS: SearchOptions = useMemo(
        () => ({
            originalLanguage: "장르 (전체)",
            translationLanguage: "평점 (전체)",
            sorting: "언어 (전체)",
        }),
        []
    );

    const [selectedOptions, setSelectedOptions] = useState<SearchOptions>({ ...DEFAULT_OPTIONS });
    const [activeDropdown, setActiveDropdown] = useState<DropdownKey | null>(null);

    const dropdownEntries = useMemo(
        () =>
            (Object.entries(dropdowns) as Array<[DropdownKey, string[]]>).map(([key, options]) => ({
                key,
                options,
            })),
        [dropdowns]
    );

    const toggleDropdown = (key: DropdownKey) => {
        setActiveDropdown((prev) => (prev === key ? null : key));
    };

    const selectOption = (key: DropdownKey, option: string) => {
        const next: SearchOptions = { ...selectedOptions, [key]: option } as SearchOptions;
        setSelectedOptions(next);
        setActiveDropdown(null);
        onChangeOptions(next);
    };

    const clearOptions = () => {
        const next = { ...DEFAULT_OPTIONS };
        setSelectedOptions(next);
        setActiveDropdown(null);
        onChangeOptions(next);
    };

    return (
        <div className="dropdown-container">
            <label>선호하는 설정을 선택하세요</label>

            {dropdownEntries.map((dropdown) => (
                <div key={dropdown.key} className="custom-select">
                    <div
                        className={`select-selected ${activeDropdown === dropdown.key ? "select-arrow-active" : ""}`}
                        onClick={() => toggleDropdown(dropdown.key)}
                    >
                        {selectedOptions[dropdown.key]}
                    </div>

                    {activeDropdown === dropdown.key && (
                        <div className="select-items">
                            {dropdown.options.map((opt) => (
                                <div key={opt} onClick={() => selectOption(dropdown.key, opt)}>
                                    {opt}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            <button className="clear-options" onClick={clearOptions}>
                초기화
            </button>
        </div>
    );
}