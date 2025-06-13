const Discount = require("../../model/discount.model");
module.exports.index = async (req, res) => {
  const discounts = await Discount.find({ deleted: false }).sort({ createdAt: -1 });;
  res.render("admin/pages/discount/index", {
    pageTitle: "Discount",
    discounts
  })
}

module.exports.create = async (req, res) => {
  try {
    const { type, value, condition, startDate, endDate, quantity } = req.body;
    const discount = new Discount({
      type,
      value,
      condition,
      quantity,
      startDate,
      endDate
    });
    discount.code = discount._id.toString().slice(-6).toUpperCase();

    await discount.save();

    res.json({
      message: "Create discount successfully",
      discount
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Create discount failed",
      error: error.message
    })
  }
}

module.exports.edit = async (req, res) => {
  try {
    const discountId = req.body.discountId;
    await Discount.updateOne(
      { _id: discountId },
      {
        $set: {
          type: req.body.type,
          value: req.body.value,
          condition: req.body.condition,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          quantity: req.body.quantity
        }
      }
    )
    res.json({
      code: 200,
      message: "Edit discount successfully"
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      code: 500,
      message: "Edit discount failed",
      error: error.message
    })
  }
}

module.exports.delete = async (req, res) => {
  try {
    const discountId = req.params.discountId;
    console.log(discountId);
    await Discount.updateOne(
      { _id: discountId },
      {
        $set: {
          deleted: true
        }
      })
    req.flash("success", "Delete discount successfully");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Delete discount failed");
    res.redirect("back");
  }

}