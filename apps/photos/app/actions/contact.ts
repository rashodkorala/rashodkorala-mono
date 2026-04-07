"use server";

interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
    const accessKey = process.env.CONTACT_FORM_KEY;
    if (!accessKey) {
        console.error("CONTACT_FORM_KEY is not configured");
        return { success: false, message: "Contact form is not configured." };
    }

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                ...data,
                access_key: accessKey,
                from_name: "A message from Photos by Rashod Korala's website",
            }),
        });

        const result = await response.json();
        return { success: result.success, message: result.message };
    } catch (error) {
        console.error("Contact form submission error:", error);
        return { success: false, message: "Failed to send message. Please try again." };
    }
}
