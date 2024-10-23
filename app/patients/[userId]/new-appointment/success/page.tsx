import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Success = async ({
	params: { userId },
	searchParams,
}: SearchParamProps) => {
	// http://localhost:3000/patients/6714cedd00192e9046d5/new-appointment/success?appointmentId=6715c09500121d90697d
	// get the appointmentId from the url using params and  search params

	const appointmentId =
		(searchParams?.appointmentId as string) || "";
	const appointment = await getAppointment(appointmentId);
	const doctor = Doctors.find(
		(doc) => doc.name === appointment.primaryPhysician,
	);
	return (
		<div className="flex h-screen max-h-screen px-[5%]">
			<div className="success-img">
				<Link href="/">
					<Image
						src="/assets/icons/logo-full.svg"
						width={1000}
						height={1000}
						alt="logo"
						className="h-10 w-fit"
					/>
				</Link>
				<section className="flex flex-col items-center">
					<Image
						src="/assets/gifs/success.gif"
						height={300}
						width={280}
						alt="success"
					/>
					<h2 className="header mb-6 max-w-[600px] text-center">
						Your{" "}
						<span className="text-green-500">appointment request</span>{" "}
						has been successfully submitted!
					</h2>
					<p>We will be in touch shortly to confirm.</p>
				</section>

				<section className="request-details">
					<p>Requested appointment details:</p>
					<div className="flex items-center gap-3">
						{doctor?.image && (
							<Image
								src={doctor.image}
								alt="doctor"
								width={100}
								height={100}
								className="size-6"
							/>
						)}
						<p className="whitespace no-wrap "> Dr. {doctor?.name}</p>
					</div>
					<div className="flex gap-2">
						<Image
							src="/assets/icons/calendar.svg"
							width={24}
							height={24}
							alt="calendar"
						/>
						<p>{formatDateTime(appointment.schedule).dateTime}</p>
					</div>
				</section>
				<Button
					className="shad-primary-btn"
					asChild>
					<Link href={`/patients/${userId}/new-appointment`}>
						New Appointment
					</Link>
				</Button>

				<p className="copyright">© 2024 Carepulse</p>
			</div>
		</div>
	);
};

export default Success;
