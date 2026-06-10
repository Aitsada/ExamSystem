import * as organizationService from "./organization.service.js";

export async function findAll(req, res) {
  try {
    const result = await organizationService.findAll();
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err });
  }
}
export async function findById(req, res) {
  console.log(req.params)
  try {
    const { id } = req.params;
    const result = await organizationService.findById(id);

    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

export async function Create(req, res) {
  try {
    const logo = req.files?.logo;

    const data = {
      Name: req.body.Name,
      Description: req.body.Description,
      CreatedBy: req.body.CreatedBy,
    };
    // if (!logo) {
    //   return res.status(500).json({ message: "กรุณาอัพโหลดรูปภาพโลโก้" });
    // }
    if (logo) {
      const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp"];

      if (!allowedMimeTypes.includes(logo.mimetype)) {
        return res.status(400).json({
          message: "อนุญาตเฉพาะ PNG, JPG, JPEG, WEBP เท่านั้น",
        });
      }

      data.Logo = logo.data;
      data.LogoMimeType = logo.mimetype;
      data.LogoOriginalName = logo.name;
      data.LogoSize = logo.size;
    }

    const result = await organizationService.create(data);

    return res.status(201).json({
      message: "สร้างหน่วยงานสำเร็จ",
      data: {
        ID: result.insertId,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการสร้างหน่วยงาน",
    });
  }
}

export async function Update(req, res) {
  try {
    const { id } = req.params;
    const data = req.body;
    const result = await organizationService.update(id, data);
    res.status(200).json({ status: "success", data: result });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
}

// Upload LOGO file

export async function getLogo(req, res) {
  try {
    const { id } = req.params;

    const organization = await organizationService.findLogoById(id);

    if (!organization || !organization.Logo) {
      return res.status(404).json({
        message: "ไม่พบ logo",
      });
    }

    res.setHeader("Content-Type", organization.LogoMimeType);
    res.setHeader("Cache-Control", "public, max-age=86400");

    return res.send(organization.Logo);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการดึง logo",
    });
  }
}

export async function uploadLogo(req, res) {
  try {
    const { id } = req.params;

    if (!req.files || !req.files.logo) {
      return res.status(400).json({
        message: "กรุณาเลือกไฟล์ logo",
      });
    }

    const logo = req.files.logo;

    const allowedMimeTypes = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedMimeTypes.includes(logo.mimetype)) {
      return res.status(400).json({
        message: "อนุญาตเฉพาะ PNG, JPG, JPEG, WEBP เท่านั้น",
      });
    }

    const affectedRows = await organizationService.updateLogo(id, {
      Logo: logo.data, // สำคัญ ตัวนี้คือ Buffer ที่จะลง LONGBLOB
      LogoMimeType: logo.mimetype,
      LogoOriginalName: logo.name,
      LogoSize: logo.size,
      LastModifiedBy: req.body.LastModifiedBy ?? null,
    });

    if (affectedRows === 0) {
      return res.status(404).json({
        message: "ไม่พบหน่วยงาน",
      });
    }

    return res.status(200).json({
      message: "อัปโหลด logo สำเร็จ",
      data: {
        ID: id,
        LogoMimeType: logo.mimetype,
        LogoOriginalName: logo.name,
        LogoSize: logo.size,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "เกิดข้อผิดพลาดในการอัปโหลด logo",
    });
  }
}
