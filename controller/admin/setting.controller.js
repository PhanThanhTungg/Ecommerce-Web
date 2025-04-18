const SettingGeneral = require("../../model/settings-general.model")


module.exports.general = async (req, res) => {
  const settingsGeneral = await SettingGeneral.findOne({})

  res.render("admin/pages/settings/general", {
    pageTitle: "Cài đặt chung",
    settingsGeneral: settingsGeneral
  })
}


module.exports.generalPatch = async (req, res) => {
  const settingsGeneral = await SettingGeneral.findOne({})

  req.body.shippingFee = {
    freeShippingThreshold: req.body.freeShippingThreshold,
    initialFee: req.body.initialFee,
    addFeePerKm: req.body.addFeePerKm,
    urbanFee: req.body.urbanFee,
    suburbanFee: req.body.suburbanFee,
    interProvincialFee: req.body.interProvincialFee,
  }
  req.body.apiKey = {
    apiOpenStreetMap : req.body.apiOpenStreetMap
  }

  if(settingsGeneral) {
    await SettingGeneral.updateOne({
      _id: settingsGeneral.id
    }, req.body)
  } else {
    const record = new SettingGeneral(req.body)
    await record.save()
  }
  res.redirect("back")
}