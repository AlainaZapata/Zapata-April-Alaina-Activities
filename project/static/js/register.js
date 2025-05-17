async function registerUser(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const res = await fetch('/create_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(data)
    });

    const result = await res.json();
    alert(result.message || result.error);
    if (res.ok) window.location.href = "/";
}