import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Laptop } from "lucide-react";
import { getOptions } from "../api/laptopApi";
import { motion } from "framer-motion";


import Navbar from "../components/Navbar";
import LaptopForm from "../components/LaptopForm";
import PredictionCard from "../components/PredictionCard";
import Footer from "../components/Footer";

function Home() {

    const [options, setOptions] = useState(null);
    const [prediction, setPrediction] = useState(null);

    useEffect(() => {

        async function fetchData() {

            const response = await getOptions();

            setOptions(response.data);

        }

        fetchData();

    }, []);

    if (!options) {
        return (
            <div className="flex h-screen items-center justify-center bg-[#131313]">

                <Loader2
                    size={50}
                    className="animate-spin text-cyan-400"
                />

            </div>
        );
    }

    return (

        <div className="min-h-screen bg-[#131313] text-white">

            <Navbar />

            <main className="mx-auto max-w-7xl px-6 py-16">

                <motion.section
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-14 text-center"
                >
                    <div className="mb-6 flex justify-center">
                        <div className="rounded-full bg-cyan-500/10 p-5">
                            <Laptop
                                size={48}
                                className="text-cyan-400"
                            />
                        </div>
                    </div>

                    <h2 className="text-5xl font-bold tracking-tight">

                        Predict Laptop Prices

                    </h2>

                    <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-400">

                        Estimate laptop prices using a Machine Learning model
                        trained on real-world laptop specifications.

                    </p>

                </motion.section>

                <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-3xl border border-cyan-400/10 bg-white/5 p-8 backdrop-blur-lg shadow-[0_0_30px_rgba(0,255,255,0.08)]"
                >
                    <LaptopForm
                        options={options}
                        setPrediction={setPrediction}
                    />

                </motion.div>

                <PredictionCard
                    price={prediction}
                />

            </main>

            <Footer />

        </div>

    );
}

export default Home;