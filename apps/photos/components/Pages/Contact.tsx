'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [formStatus, setFormStatus] = useState("");
    const access_key = process.env.NEXT_PUBLIC_CONTACT_FORM_KEY;


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        if (access_key) {
            formData.append("access_key", access_key);
        } else {
            setFormStatus("Access key is missing.");
            return;
        }

        const object = Object.fromEntries(formData);
        const json = JSON.stringify(object);

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: json,
        });

        const result = await response.json();
        if (result.success) {
            setFormStatus("Message sent successfully!");
            setFormData({
                name: "",
                email: "",
                subject: "",
                message: ""
            });
            setFormStatus("");
            toast.success("Message sent successfully!");
        } else {
            setFormStatus(result.message);
            toast.error(result.message);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-white">
            <main className="pt-20">
                <div className="max-w-4xl mx-auto px-6 py-12">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-light text-gray-900 mb-6 tracking-tight">
                            Get In Touch
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            I&apos;d love to hear from you. Whether you&apos;re interested in prints,
                            collaborations, or just want to say hello, feel free to reach out.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                        Name
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                        Subject
                                    </label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        required
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                                >
                                    Send Message
                                </Button>

                                {formStatus && <p className="text-slate-600 mt-4 font-thin">{formStatus}</p>}
                                <input type="hidden" name="from_name" value="A message from Photos by Rashod Korala's website "></input>
                            </form>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-medium text-gray-900 mb-4">Contact Information</h3>
                                <div className="space-y-3 text-gray-600">
                                    <p>📧 rashodkorala2002@gmail.com</p>
                                    <p>📍 St. John&apos;s, Canada</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xl font-medium text-gray-900 mb-4">Response Time</h3>
                                <p className="text-gray-600">
                                    I typically respond to all inquiries within 24-48 hours.
                                    For urgent matters, please email directly.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}