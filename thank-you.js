document.addEventListener("DOMContentLoaded", () => {

    const hasMouse = window.matchMedia("(pointer: fine)").matches;
    const cursor = document.querySelector(".custom-cursor");

    // No custom cursor on phones/tablets
    if (!hasMouse) {
        if (cursor) {
            cursor.remove();
        }
        return;
    }

    // Stop if the cursor element doesn't exist
    if (!cursor) {
        console.warn("KoraCraft custom cursor not found.");
        return;
    }

    document.addEventListener("mousemove", (e) => {

        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.04,
            ease: "power2.out"
        });

    });

});