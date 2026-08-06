def fetch_processor(cpu):
    if cpu in ["Intel Core i3","Intel Core i5","Intel Core i7"]:
        return cpu
    if cpu.startswith("Intel"):
        return "Other Intel Processor"
    return "AMD Processor"

def categorize_os(os_name):
    if os_name in ["Windows 10","Windows 10 S","Windows 7"]:
        return "Windows"
    if os_name in ["macOS","MAC OS X"]:
        return "Mac"
    return "Others/No OS/Linux"