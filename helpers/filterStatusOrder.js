module.exports = (query) => {
	let filterStatusOrder = [
		{
			name: "All",
			status: "",
			class: ""
		},
		{
			name: "Pending",
			status: "pending",
			class: ""
		},
		{
			name: "Pending-Payment",
			status: "pending-payment",
			class: ""
		},
		{
			name: "Shipping",
			status: "shipping",
			class: ""
		},
		{
			name: "Delivered",
			status: "delivered",
			class: ""
		},
		{
			name: "Cancelled",
			status: "cancelled",
			class: ""
		},
	]
	// query status
	if (query.status) {
		const index = filterStatusOrder.findIndex(item => item.status == query.status)
		filterStatusOrder[index].class = "active"
	}
	else {
		const index = filterStatusOrder.findIndex(item => item.status == "")
		filterStatusOrder[index].class = "active"
	}
	return filterStatusOrder
}