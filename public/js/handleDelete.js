document.getElementById('deleteButton').addEventListener('click', async () => {
    const selectedEmailIds = Array.from(document.querySelectorAll('.email-checkbox:checked'))
        .map(checkbox => checkbox.getAttribute('data-email-id'));

    if (selectedEmailIds.length === 0) {
        alert('Select one or more emails to delete.');
        return;
    }

    const inbox = window.location.pathname.includes('inbox');

    try {
        const response = await fetch('/deleteEmails', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ emailIds: selectedEmailIds, inbox }),
        });

        const result = await response.json();
        if (result.success) {
            selectedEmailIds.forEach(id => {
                const emailDiv = document.querySelector(`.email-item[data-email-id="${id}"]`);
                if (emailDiv) {
                    emailDiv.remove();
                } else {
                    console.warn(`No email found for ID: ${id}`);
                }
            });
        } else {
            alert('Fail while deleting emails');
        }
    } catch (error) {
        console.error('Error deleting emails:', error);
        alert('Error deleting emails');
    }
});
