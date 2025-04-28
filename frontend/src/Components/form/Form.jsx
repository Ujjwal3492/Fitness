import React, { useState } from "react";

// --- Contact Form Component ---
// Props: None (it manages its own state)

export function Form() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    interest: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare the message for WhatsApp
    const message = `New Inquiry: \nName: ${formData.name} \nPhone: ${formData.phone} \nInterest: ${formData.interest}`;

    // Create the WhatsApp URL
    const whatsappURL = `https://wa.me/919755872714?text=${encodeURIComponent(
      message
    )}`;

    // Open the WhatsApp URL (this will redirect to WhatsApp)
    window.open(whatsappURL, "_blank");

    // Send data to Google Sheets
    const sendToGoogleSheets = async () => {
      try {
        await fetch("https://script.google.com/macros/s/YOUR_SCRIPT_URL/exec", {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        console.log("Data sent to Google Sheets");
        setSubmitted(true);
        setTimeout(() => {
          setFormData({ name: "", phone: "", interest: "" });
          setSubmitted(false);
        }, 3000);
      } catch (error) {
        console.error("Error submitting to Google Sheets", error);
      }
    };

    // Execute both actions simultaneously
    await Promise.all([sendToGoogleSheets()]);
  };

  return (
    // Use soft-white background for the section
    <section id="contact" className="py-12 md:py-20 bg-[#fffffe]">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Keep card background white for contrast, update border color */}
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg border-t-4 border-orange-600">
          {" "}
          {/* Primary accent border */}
          <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
            Get Started Today!
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Tell us a bit about yourself and what you're looking to achieve.
          </p>
          {submitted ? (
            <div className="text-center p-4 bg-green-100 text-green-700 rounded-md">
              Thanks for reaching out! We'll be in touch soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  // Update focus ring color
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-600 focus:border-orange-600 transition duration-150 ease-in-out"
                  placeholder="e.g., Jane Doe"
                />
              </div>

              {/* Phone Number Field */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  // Update focus ring color
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-600 focus:border-orange-600 transition duration-150 ease-in-out"
                  placeholder="e.g., 9876543210"
                />
              </div>

              {/* Interest Field */}
              <div>
                <label
                  htmlFor="interest"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  What do you want to learn or achieve?
                </label>
                <textarea
                  id="interest"
                  name="interest"
                  rows="4"
                  value={formData.interest}
                  onChange={handleChange}
                  required
                  // Update focus ring color
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-600 focus:border-orange-600 transition duration-150 ease-in-out"
                  placeholder="e.g., Lose weight, build muscle, learn yoga..."
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button
                  type="submit"
                  // Update button color to primary accent, use white text for contrast
                  className="inline-flex justify-center py-3 px-8 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-600 transition duration-150 ease-in-out"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// If using separate files, you might export it like this:
// export default ContactForm;
