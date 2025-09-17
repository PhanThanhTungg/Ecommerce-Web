const Discount = require("../../model/discount.model");
const DiscountUser = require("../../model/discount-user.model");
module.exports.index = async (req, res) => {

  _io.once("connection", (socket) => {
    console.log('a user connected1 ' + socket.id);
    socket.on("client-get-discount", (data)=>{
      console.log(data);
    })
  });

  const type = req.params.type;
  const now = new Date();

  const find = {
    startDate: { $lte: now },
    endDate: { $gte: now },
    quantity: { $gt: 0 },
    isActive: true,
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

    const discountFound = await Discount.findOne({ _id: discountId });
    if(discountFound.quantity == 0){
      req.flash("error", "Get discount failed");
      return res.redirect("back");
    }

    await Discount.updateOne({ _id: discountId }, { $inc: { quantity: -1 } });

    _io.once('connection', (socket) => {
      _io.emit("sub-quantity-discount", {
        discountId: discountFound.id,
        quantity: discountFound.quantity - 1
      })
    })

    req.flash("success", "Get discount successfully");
    res.redirect("back");
  } catch (error) {
    console.log(error);
    req.flash("error", "Get discount failed");
    res.redirect("back");
  }
}