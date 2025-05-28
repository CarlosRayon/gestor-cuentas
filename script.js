function calculateAndDisplayExpenses() {
    // Get input values from User 1, treating empty as 0
    const u1_alquiler = parseFloat(document.getElementById('user1_alquiler').value) || 0;
    const u1_coche = parseFloat(document.getElementById('user1_coche').value) || 0;
    const u1_compra = parseFloat(document.getElementById('user1_compra').value) || 0;
    const u1_mascota = parseFloat(document.getElementById('user1_mascota').value) || 0;

    // Get input values from User 2, treating empty as 0
    const u2_alquiler = parseFloat(document.getElementById('user2_alquiler').value) || 0;
    const u2_coche = parseFloat(document.getElementById('user2_coche').value) || 0;
    const u2_compra = parseFloat(document.getElementById('user2_compra').value) || 0;
    const u2_mascota = parseFloat(document.getElementById('user2_mascota').value) || 0;

    // Calculate totals per category
    const totalAlquiler = u1_alquiler + u2_alquiler;
    const totalCoche = u1_coche + u2_coche;
    const totalCompra = u1_compra + u2_compra;
    const totalMascota = u1_mascota + u2_mascota;

    // Calculate totals per user
    const totalUser1 = u1_alquiler + u1_coche + u1_compra + u1_mascota;
    const totalUser2 = u2_alquiler + u2_coche + u2_compra + u2_mascota;

    // Calculate average and debt
    const overallTotal = totalUser1 + totalUser2;
    const averageExpense = overallTotal / 2;

    let debtInfoText = "No one owes anything.";
    if (totalUser1 > averageExpense) {
        debtInfoText = `User 2 owes User 1 €${(totalUser1 - averageExpense).toFixed(2)}`;
    } else if (totalUser2 > averageExpense) {
        debtInfoText = `User 1 owes User 2 €${(totalUser2 - averageExpense).toFixed(2)}`;
    }

    // Display results
    document.getElementById('total_alquiler').textContent = totalAlquiler.toFixed(2);
    document.getElementById('total_coche').textContent = totalCoche.toFixed(2);
    document.getElementById('total_compra').textContent = totalCompra.toFixed(2);
    document.getElementById('total_mascota').textContent = totalMascota.toFixed(2);

    document.getElementById('total_user1').textContent = totalUser1.toFixed(2);
    document.getElementById('total_user2').textContent = totalUser2.toFixed(2);

    document.getElementById('average_expense').textContent = averageExpense.toFixed(2);
    document.getElementById('debt_info').textContent = debtInfoText;
}

// Attach event listener to the button
const calculateButton = document.getElementById('calculate_button');
if (calculateButton) {
    calculateButton.addEventListener('click', calculateAndDisplayExpenses);
} else {
    console.error("Button with ID 'calculate_button' not found.");
}
