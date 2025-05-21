const Discount = require("../../model/discount.model");
const DiscountUser = require("../../model/discount-user.model");
module.exports.index = async (req, res) => {
  const type = req.params.type;
  const now = new Date();

  const find = {
    startDate: { $lte: now },
    endDate: { $gte: now },
    quantity: { $gt: 0 },
  }

  const listMyDiscount = await DiscountUser.find({ userId: res.locals.user._id }).select("discountId").lean();
  const discountIds = listMyDiscount.map(item => item.discountId);
  if (type == "myDiscount") {
    find._id = { $in: discountIds }
  }
  else {
    find._id = { $nin: discountIds }
    find.type = type;
  }

  const discounts = await Discount.find(find).sort({ createdAt: -1 }).lean();

  res.render("client/pages/discount/index", {
    pageTitle: "Discount",
    discounts: discounts,
    type
  })
}

module.exports.getDiscount = async (req, res) => {
  try {
    const { userId, discountId } = req.body;
    const discount = new DiscountUser({
      userId,
      discountId
    })
    await discount.save();
    req.flash("success", "Get discount successfully");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Get discount failed");
    res.redirect("back");
  }
}