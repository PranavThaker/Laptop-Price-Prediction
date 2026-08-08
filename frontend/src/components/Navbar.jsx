function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-cyan-400/10 bg-[#131313]/80 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

                <div>
                    <h1 className="text-2xl font-bold tracking-wide text-cyan-300">
                        LaptopPredict
                    </h1>

                    <p className="text-xs text-gray-400">
                        Machine Learning Powered
                    </p>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
                        Random Forest Regressor
                    </span>
                </div>

            </div>
        </header>
    );
}

export default Navbar;