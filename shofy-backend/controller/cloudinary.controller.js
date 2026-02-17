const fs = require("fs");
const { cloudinaryServices } = require("../services/cloudinary.service");

// add image
const saveImageCloudinary = async (req, res,next) => {
  // console.log(req.file)
  try {
    const result = await cloudinaryServices.cloudinaryImageUpload(
      req.file.buffer
    );
    res.status(200).json({
      success: true,
      message: "image uploaded successfully",
      data:{url:result.secure_url,id:result.public_id},
    });
  } catch (err) {
    console.log(err);
    next(err)
  }
};

// add image
const addMultipleImageCloudinary = async (req, res) => {
  try {
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No files provided",
      });
    }

    // Array to store Cloudinary image upload responses
    const uploadResults = [];

    for (const file of files) {
      try {
        // Upload image to Cloudinary - use buffer if available, otherwise path
        const imageBuffer = file.buffer || (file.path ? fs.readFileSync(file.path) : null);
        if (!imageBuffer) {
          console.error("No buffer or path available for file:", file);
          continue;
        }
        
        const result = await cloudinaryServices.cloudinaryImageUpload(imageBuffer);
        uploadResults.push(result);

        // Delete temporary local file if it exists
        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (fileError) {
        console.error("Error uploading file:", fileError);
        // Continue with other files even if one fails
      }
    }

    res.status(200).json({
      success: true,
      message: "image uploaded successfully",
      data:
        uploadResults.length > 0
          ? uploadResults.map((res) => ({
              url: res.secure_url,
              id: res.public_id,
            }))
          : [],
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Failed to upload image",
    });
  }
};

// cloudinary ImageDelete
const cloudinaryDeleteController = async (req, res) => {
  try {
    const { folder_name, id } = req.query;
    const public_id = `${folder_name}/${id}`;
    const result = await cloudinaryServices.cloudinaryImageDelete(public_id);
    res.status(200).json({
      success: true,
      message: "delete image successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Failed to delete image",
    });
  }
};

exports.cloudinaryController = {
  cloudinaryDeleteController,
  saveImageCloudinary,
  addMultipleImageCloudinary,
};
