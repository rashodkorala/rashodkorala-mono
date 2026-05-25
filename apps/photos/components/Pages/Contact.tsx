'use client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { submitContactForm } from "@/app/actions/contact";
import { motion } from "framer-motion";
import ThemeToggle from "@/components/ThemeToggle";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [formStatus, setFormStatus] = useState("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const result = await submitContactForm(formData);
        if (result.success) {
            setFormData({ name: "", email: "", subject: "", message: "" });
            setFormStatus("");
            toast.success("Message sent successfully!");
        } else {
            setFormStatus(result.message);
            toast.error(result.message);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-background text-foreground transition-colors duration-300">
            <motion.section
                className="px-4 sm:px-6 md:px-12 lg:px-16 py-12 border-b border-border"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <div className="flex justify-between items-center w-full mb-10">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xs uppercase tracking-[0.45em] text-muted-foreground"
                    >
                        Contact
                    </motion.p>
                    <div className="hidden md:block">
                        <ThemeToggle />
                    </div>
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] font-light mb-4"
                >
                    Get In Touch
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed mb-12"
                >
                    I&apos;d love to hear from you. Whether you&apos;re interested in prints,
                    collaborations, or just want to say hello, feel free to reach out.
                </motion.p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
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
                                <label htmlFor="email" className="block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
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
                                <label htmlFor="subject" className="block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
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
                                <label htmlFor="message" className="block text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">
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
                                className="w-full min-h-[44px] bg-foreground hover:bg-foreground/90 text-background text-xs uppercase tracking-[0.3em]"
                            >
                                Send Message
                            </Button>
                            {formStatus && <p className="text-muted-foreground mt-4 text-sm font-light">{formStatus}</p>}
                        </form>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="space-y-8"
                    >
                        <div>
                            <h3 className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-4">Contact Information</h3>
                            <div className="space-y-3 text-sm text-foreground font-light">
                                <p>hello@rashodkorala.com</p>
                                <p className="text-muted-foreground">St. John&apos;s, Canada</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-4">Response Time</h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                I typically respond to all inquiries within 24–48 hours.
                                For urgent matters, please email directly.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
}
