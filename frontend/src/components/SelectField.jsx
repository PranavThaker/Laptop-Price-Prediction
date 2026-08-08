function SelectField({
    label,
    name,
    value,
    options,
    onChange,
    valueKey = null,
    labelKey = null,
}) {
    return (
        <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400">
                {label}
            </label>

            <div className="relative">
                <select
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full appearance-none rounded-xl border border-gray-700 bg-[#1a1a1a] px-4 py-3 pr-10 text-white outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
                >
                    <option value="">Select {label}</option>

                    {options?.map((item) => {
                        const optionValue = valueKey ? item[valueKey] : item;
                        const optionLabel = labelKey ? item[labelKey] : item;

                        return (
                            <option key={optionValue} value={optionValue}>
                                {optionLabel}
                            </option>
                        );
                    })}
                </select>

                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    ▼
                </span>
            </div>
        </div>
    );
}

export default SelectField;