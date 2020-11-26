function sendMail(contactForm) {
    // Service ID is the first part (found on EmailJs) and the second part is the Template ID (also on EmailJS)
    emailjs.send("service_y1trakm", "template_1kb86ce", {
        "from_name": contactForm.name.value,
        "from_email": contactForm.emailaddress.value,
        "project_request": contactForm.projectsummary.value
    })
    .then(
        function(response) {
            console.log("SUCCESS", response);
        },
        function(error) {
            console.log("FAILED", error);
        }
    );
    return false;  // To block from loading a new page
}