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
  if (req.body.logo) {
    req.body.logo = req.body.logo[0]
  }
  let bannerObject;
  if (req.body.bannerImage) req.body.bannerImage = req.body.bannerImage[0];

  const { bannerImage, bannerTitle, bannerSubtitle } = req.body;
  if (bannerImage && bannerTitle && bannerSubtitle) {
    bannerObject = {
      image: bannerImage,
      title: bannerTitle,
      subTitle: bannerSubtitle
    };
  }

  req.body.shippingFee = {
    freeShippingThreshold: req.body.freeShippingThreshold,
    initialFee: req.body.initialFee,
    addFeePerKm: req.body.addFeePerKm,
    urbanFee: req.body.urbanFee,
    suburbanFee: req.body.suburbanFee,
    interProvincialFee: req.body.interProvincialFee,
  }
  req.body.apiKey = {
    apiOpenStreetMap: req.body.apiOpenStreetMap
  }

  console.log(req.body);
  console.log(bannerObject);
  if (settingsGeneral) {
    if (bannerObject) {
      await SettingGeneral.updateOne(
        { _id: settingsGeneral.id },
        {
          $push: {
            banner: bannerObject
          }
        }
      );
    }

    await SettingGeneral.updateOne({
      _id: settingsGeneral.id
    }, req.body)
  } else {
    const record = new SettingGeneral(req.body)
    await record.save()
  }
  res.redirect("back")
}