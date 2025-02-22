module.exports = (query)=>{
    let filterStatusOrder=[
        {
            name: "All",
            status: "",
            class: ""
        },
        {
            name: "Pending",
            status: "xacNhan",
            class: ""
        },
        {
            name: "Processing",
            status: "daXacNhan",
            class: ""
        },
        {
            name: "Shipped",
            status: "dangVanChuyen",
            class: ""
        },
        {
            name: "Delivered",
            status: "daGiao",
            class: ""
        },
        {
            name: "Paid",
            status: "daThanhToan",
            class: ""
        },
        {
            name: "Canceled",
            status: "daHuy",
            class: ""
        },
        {
            name: "Rejected",
            status: "biBom",
            class: ""
        }
        
    ]
    // query status
    if(query.status){
        const index = filterStatusOrder.findIndex(item => item.status == query.status)
        filterStatusOrder[index].class ="active"
    }
    else{
        const index = filterStatusOrder.findIndex(item => item.status == "")
        filterStatusOrder[index].class ="active"
    }
    return filterStatusOrder
}