import { Router } from "express";
import { 
    createUserController, 
    getUserByIdController, 
    getUserByTelegramChatIdController
} from "../controllers/user.controller";

const router = Router();

router.post("/", createUserController);

router.get("/:id", getUserByIdController);
router.get("/telegram/:telegram_chat_id", getUserByTelegramChatIdController);

export default router;