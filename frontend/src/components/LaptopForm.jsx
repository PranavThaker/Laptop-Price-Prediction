import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Sparkles } from "lucide-react";
import SelectField from "./SelectField";
import InputField from "./InputField";
import { predictPrice } from "../api/laptopApi";
import {
    Laptop,
    Monitor,
    Cpu,
    HardDrive
} from "lucide-react";

function LaptopForm({ options, setPrediction }) {

    const [formData, setFormData] = useState({
        Company: "",
        TypeName: "",
        Ram: "",
        Weight: "",
        Touchscreen: "",
        Ips: "",
        Inches: "",
        Resolution: "",
        X_res: "",
        Y_res: "",
        Cpu: "",
        HDD: "",
        SSD: "",
        Gpu: "",
        OpSys: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        if (name === "Resolution") {

            const selected = options.resolution.find(
                (item) => item.label === value
            );

            setFormData({
                ...formData,
                Resolution: value,
                X_res: selected.x,
                Y_res: selected.y
            });

            return;
        }

        setFormData({
            ...formData,
            [name]: value
        });

    };
    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);
            if (isNaN(formData.Weight)) {
                alert("Enter a valid weight.");
                return;
            }

            if (isNaN(formData.Inches)) {
                alert("Enter a valid screen size.");
                return;
            }
            if (formData.Weight <= 0) {
                alert("Weight must be greater than 0 kg.");
                return;
            }

            if (formData.Weight > 5) {
                alert("Please enter a valid laptop weight.");
                return;
            }

            if (formData.Inches <= 0) {
                alert("Screen size must be greater than 0.");
                return;
            }

            if (formData.Inches < 8 || formData.Inches > 18) {
                alert("Please enter a valid screen size.");
                return;
            }

            const requiredFields = [
                "Company",
                "TypeName",
                "Ram",
                "Touchscreen",
                "Ips",
                "Resolution",
                "Cpu",
                "HDD",
                "SSD",
                "Gpu",
                "OpSys",
            ];

            for (const field of requiredFields) {
                if (!formData[field]) {
                    alert(`${field} is required.`);
                    return;
                }
            }

            const payload = {
                Company: formData.Company,
                TypeName: formData.TypeName,
                Ram: Number(formData.Ram),
                Weight: Number(formData.Weight),
                Touchscreen: Number(formData.Touchscreen),
                Ips: Number(formData.Ips),
                Inches: Number(formData.Inches),
                X_res: Number(formData.X_res),
                Y_res: Number(formData.Y_res),
                Cpu: formData.Cpu,
                HDD: Number(formData.HDD),
                SSD: Number(formData.SSD),
                Gpu: formData.Gpu,
                OpSys: formData.OpSys
            };

            const response = await predictPrice(payload);

            setPrediction(response.data["Predicted Price"]);

        } catch (error) {

            console.error(error);

            alert("Prediction failed.");

        } finally {

            setLoading(false);

        }

    };
    return (
        <div className="mx-auto max-w-5xl">
            <form onSubmit={handleSubmit}>
                <div>
                    <div className="mb-6 flex items-center gap-3 border-b border-cyan-500/20 pb-2">

                        <Laptop className="text-cyan-400" />

                        <h2 className="text-xl font-semibold text-cyan-300">

                            Base Specifications

                        </h2>

                    </div>
                    <div className="grid gap-6 md:grid-cols-2">

                        <SelectField
                            label="Company"
                            name="Company"
                            value={formData.Company}
                            options={options.companies}
                            onChange={handleChange}
                        />

                        <SelectField
                            label="Laptop Type"
                            name="TypeName"
                            value={formData.TypeName}
                            options={options.types}
                            onChange={handleChange}
                        />

                        <SelectField
                            label="RAM"
                            name="Ram"
                            value={formData.Ram}
                            options={options.ram}
                            onChange={handleChange}
                        />

                        <InputField
                            label="Weight (in KG)"
                            name="Weight"
                            type="number"
                            value={formData.Weight}
                            onChange={handleChange}
                        />
                    </div>
                </div >
                <br />
                <div>
                    <div className="mb-6 flex items-center gap-3 border-b border-cyan-500/20 pb-2">

                        <Monitor className="text-cyan-400" />

                        <h2 className="text-xl font-semibold text-cyan-300">

                            Display

                        </h2>

                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <SelectField
                            label="Touchscreen"
                            name="Touchscreen"
                            value={formData.Touchscreen}
                            options={options.touchscreen}
                            valueKey="value"
                            labelKey="label"
                            onChange={handleChange}
                        />
                        <SelectField
                            label="IPS Display"
                            name="Ips"
                            value={formData.Ips}
                            options={options.ips}
                            valueKey="value"
                            labelKey="label"
                            onChange={handleChange}

                        />
                        <InputField
                            label="Screen Size (Inches)"
                            name="Inches"
                            type="number"
                            value={formData.Inches}
                            onChange={handleChange}
                        />

                        <SelectField
                            label="Resolution"
                            name="Resolution"
                            value={formData.Resolution}
                            options={options.resolution}
                            labelKey="label"
                            valueKey="label"
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <br />
                <div>
                    <div className="mb-6 flex items-center gap-3 border-b border-cyan-500/20 pb-2">

                        <Cpu className="text-cyan-400" />

                        <h2 className="text-xl font-semibold text-cyan-300">

                            Hardware

                        </h2>

                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                        <SelectField
                            label="CPU"
                            name="Cpu"
                            value={formData.Cpu}
                            options={options.cpu}
                            onChange={handleChange}
                        />

                        <SelectField
                            label="HDD"
                            name="HDD"
                            value={formData.HDD}
                            options={options.hdd}
                            onChange={handleChange}
                        />

                        <SelectField
                            label="SSD"
                            name="SSD"
                            value={formData.SSD}
                            options={options.ssd}
                            onChange={handleChange}
                        />

                        <SelectField
                            label="GPU"
                            name="Gpu"
                            value={formData.Gpu}
                            options={options.gpu}
                            onChange={handleChange}
                        />

                        <SelectField
                            label="Operating System"
                            name="OpSys"
                            value={formData.OpSys}
                            options={options.os}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <br />
                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 py-4 text-lg font-semibold text-black transition duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(34,211,238,.5)]"
                >

                    <span>

                        {loading ? (
                            <>
                                <Loader2
                                    size={20}
                                    className="animate-spin"
                                />
                                Predicting...
                            </>
                        ) : (
                            <>
                                Predict Price
                            </>
                        )}
                    </span>

                </button>
            </form >
        </div>
    );
}

export default LaptopForm;