import { Info } from "@/features/user/services/get-my-info";
import { data } from "framer-motion/client";

export type NewUserInfo = {
    fullName: string;
    dateOfBirth: string;
    gender: "MALE" | "FEMALE" | "OTHER";
};

type ApiResponse = {
    code: number;
    message: string;
    result: Info;
}

type PostMyInfoResult = {
    ok: boolean;
    message: string;
}

export async function postMyInfo(newInfo: NewUserInfo): Promise<PostMyInfoResult> {
    const url = process.env.NEXT_PUBLIC_USER_PROFILE_URL;

    if (!url) {
        return {
            ok: false,
            message: "Không thể kết nối tới server. Xin vui lòng thử lại sau.",
        };
    }

    try {
        const res = await fetch(url, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                Accept: "*/*",
            },
            body: JSON.stringify(newInfo),
        });

        const data: ApiResponse = await res.json();

        if (!res.ok) {
            return {
                ok: false,
                message: data.message,
            };
        }

        return {
            ok: true,
            message: data.message,
        };
    } catch {
        return {
            ok: false,
            message: "Không thể kết nối tới server. Xin vui lòng thử lại sau.",
        };
    }
}
