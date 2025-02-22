module.exports = (query)=>{
    let objectSearch={
        keyword: "",
    }
    if(query.keyword){
        objectSearch.keyword = query.keyword
        const regex = RegExp(objectSearch.keyword, "i")  // Trả về regex có chứa keyword - "i": không phân biệt hoa thường
        objectSearch.regex = regex
    }
    return objectSearch
}