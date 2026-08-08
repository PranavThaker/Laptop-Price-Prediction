function InputField({
    label,
    name,
    type = "text",
    value,
    onChange,
}) {
    return (
        <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full rounded-xl border border-gray-700 bg-[#1a1a1a] px-4 py-3 text-white outline-none transition-all duration-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            />
        </div>
    );
}

export default InputField;