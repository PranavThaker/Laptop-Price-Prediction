import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

function PredictionCard({ price }) {

    if (!price)
        return null;

    return (

        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: .5 }}
            className="mt-10 rounded-3xl border border-cyan-400/20 bg-cyan-400/5 p-10 text-center shadow-[0_0_25px_rgba(0,255,255,0.08)]">

            <h2 className="text-xl font-semibold text-cyan-300">

                Prediction Result

            </h2>

            <p className="mt-6 text-5xl font-bold">

                {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                    maximumFractionDigits: 0,
                }).format(price)}

            </p>

            <p className="mt-3 text-gray-400">

                Estimated Market Price

            </p>

        </motion.div>

    );

}

export default PredictionCard;