const Favorite=require('../models/add_to_favorite')


const addToFavorite= async (req, res) => {
  try {
    const { userId, lawyerId } = req.body;

    const existing = await Favorite.findOne({ userId, lawyerId });
    if (existing) {
      // Remove if exists
      await Favorite.findByIdAndDelete(existing._id);
      return res.status(200).json({ message: "Removed from favorites", isFavorite: false });
    } else {
      // Add if not exists
      const fav = new Favorite({ userId, lawyerId });
      await fav.save();
      return res.status(201).json({ message: "Added to favorites", isFavorite: true });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// 📦 Get user's favorite lawyers
const getFavorite= async (req, res) => {
  try {
    const { userId } = req.params;
    const favorites = await Favorite.find({ userId }).populate("lawyerId");
    res.status(200).json(favorites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports={addToFavorite,getFavorite}