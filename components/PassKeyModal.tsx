"use client";

import React, { useEffect, useState } from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { decryptKey, encryptKey } from "@/lib/utils";

const PassKeyModal = () => {
	const [open, setOpen] = useState(true);
	const [passKey, setPassKey] = useState("");
	const [error, setError] = useState("");
	const path = usePathname();

	const router = useRouter();
	const closeModal = () => {
		setOpen(false);
		router.push("/");
	};

	const encryptedKey =
		typeof window !== "undefined"
			? window.localStorage.getItem("accessKey")
			: null;

	// useEffect(() => {
	// 	const accessKey = encryptedKey && decryptKey(encryptedKey);

	// 	if (path) {
	// 		if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
	// 			setOpen(false);
	// 			router.push("/admin");
	// 		} else {
	// 			setOpen(true);
	// 		}
	// 	}
	// }, [encryptedKey]);

	//Use of sessionStorage instead of localStorage
	useEffect(() => {
		// Check for stored passkey in sessionStorage on page load
		const encryptedKey =
			typeof window !== "undefined"
				? sessionStorage.getItem("accessKey")
				: null;

		const accessKey = encryptedKey
			? decryptKey(encryptedKey)
			: null;

		// Only allow access to /admin if passkey matches
		if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
			setOpen(false);
			router.push("/admin");
		}
	}, [path, router]);

	const validatePasskey = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
	) => {
		e.preventDefault();
		if (passKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
			const encryptedKey = encryptKey(passKey);
			// localStorage.setItem("accessKey", encryptedKey);
			sessionStorage.setItem("accessKey", encryptedKey);
			router.push("/admin");
			setOpen(false);
		} else {
			setError("Invalid passKey. Please try again.");
		}
	};

	return (
		<AlertDialog
			open={open}
			onOpenChange={setOpen}>
			<AlertDialogContent className="shad-alert-dialog">
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-start justify-between">
						Admin Access Verification
						<Image
							src="/assets/icons/close.svg"
							alt="close"
							width={20}
							height={20}
							onClick={() => closeModal()}
							className="cursor-pointer"
						/>
					</AlertDialogTitle>
					<AlertDialogDescription>
						To access the admin page, please enter the passKey.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div>
					<InputOTP
						maxLength={6}
						value={passKey}
						onChange={(value) => setPassKey(value)}>
						<InputOTPGroup className="shad-otp">
							<InputOTPSlot
								index={0}
								className="shad-otp-slot"
							/>
							<InputOTPSlot
								index={1}
								className="shad-otp-slot"
							/>
							<InputOTPSlot
								index={2}
								className="shad-otp-slot"
							/>
							<InputOTPSlot
								index={3}
								className="shad-otp-slot"
							/>
							<InputOTPSlot
								index={4}
								className="shad-otp-slot"
							/>
							<InputOTPSlot
								index={5}
								className="shad-otp-slot"
							/>
						</InputOTPGroup>
					</InputOTP>

					{error && (
						<p className="shad-error text-14-regular mt-4 flex justify-center">
							{error}
						</p>
					)}
				</div>
				<AlertDialogFooter>
					<AlertDialogAction
						onClick={(e) => validatePasskey(e)}
						className="shad-primary-btn w-full">
						Enter Admin PassKey
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};

export default PassKeyModal;
