import Analysis from "../models/Analysis.js";

export const history=async(req,res)=>{
    try {
        const his = await Analysis.find().sort({ createdAt: -1 });
        res.json(his);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch history" });
    }
}
