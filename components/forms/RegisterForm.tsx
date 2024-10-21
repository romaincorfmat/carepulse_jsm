"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { registerPatient } from "@/lib/actions/patient.actions";
import { FormFieldType } from "./PatientForm";
import {
	Doctors,
	GenderOptions,
	IdentificationTypes,
	PatientFormDefaultValues,
} from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import FileUploader from "../FileUploader";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

const RegisterForm = ({ user }: { user: User }) => {
	const [isLoading, setIsLoading] = useState(false);
	const router = useRouter();

	// 1. Define your form.
	const form = useForm<z.infer<typeof PatientFormValidation>>({
		resolver: zodResolver(PatientFormValidation),
		defaultValues: {
			...PatientFormDefaultValues,
			name: user.name,
			email: user.email,
			phone: user.phone,
		},
	});

	// 2. Define a submit handler.
	async function onSubmit(
		values: z.infer<typeof PatientFormValidation>,
	) {
		setIsLoading(true);
		console.log(values);
		let formData = new FormData();

		if (
			values.identificationDocument &&
			values.identificationDocument.length > 0
		) {
			console.log("Processing identification document...");
			const blobFile = new Blob(
				[values.identificationDocument[0]],
				{
					type: values.identificationDocument[0].type,
				},
			);

			formData = new FormData();
			formData.append("blobFile", blobFile);
			formData.append(
				"fileName",
				values.identificationDocument[0].name,
			);
		} else {
			console.log("No identification document provided.");
		}

		try {
			// const patientData = {
			// 	...values,
			// 	userId: user.$id,
			// 	birtDate: new Date(values.birthDate),
			// 	identificationDocument: formData,
			// };
			// console.log("Submitting patient data...", patientData);
			// //@ts-ignore
			// const patient = await registerPatient(patientData);

			// if (patient) {
			// 	router.push(`/patient/${user.$id}/new-appointment`);
			// 	console.log("Patient registered successfully:", patient);
			// }

			const patient = {
				userId: user.$id,
				name: values.name,
				email: values.email,
				phone: values.phone,
				birthDate: new Date(values.birthDate),
				gender: values.gender,
				address: values.address,
				occupation: values.occupation,
				emergencyContactName: values.emergencyContactName,
				emergencyContactNumber: values.emergencyContactNumber,
				primaryPhysician: values.primaryPhysician,
				insuranceProvider: values.insuranceProvider,
				insurancePolicyNumber: values.insurancePolicyNumber,
				allergies: values.allergies,
				currentMedication: values.currentMedication,
				familyMedicalHistory: values.familyMedicalHistory,
				pastMedicalHistory: values.pastMedicalHistory,
				identificationType: values.identificationType,
				identificationNumber: values.identificationNumber,
				identificationDocument: values.identificationDocument
					? formData
					: undefined,
				privacyConsent: values.privacyConsent,
				treatmentConsent: values.treatmentConsent,
				disclosureConsent: values.disclosureConsent,
			};

			const newPatient = await registerPatient(patient);

			if (newPatient) {
				router.push(`/patients/${user.$id}/new-appointment`);
			}
		} catch (error) {
			console.error("Error during patient registration:", error);

			console.log(error);
		} finally {
			setIsLoading(false);
		}
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
	}
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-12 flex-1">
				<section className="space-y-4">
					<h1 className="header">Welcome 👏</h1>
					<p className="text-dark-700">
						Let us know more about yourself.
					</p>
				</section>
				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<h2 className="sub-header">Personal Informations</h2>
					</div>

					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name="name"
						label="Full Name"
						iconSrc="/assets/icons/user.svg"
						iconAlt="user"
						placeholder="Romain"
					/>

					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							fieldType={FormFieldType.INPUT}
							control={form.control}
							name="email"
							label="Email"
							iconSrc="/assets/icons/email.svg"
							iconAlt="email"
							placeholder="johndoe@gmail.com"
						/>

						<CustomFormField
							fieldType={FormFieldType.PHONE_INPUT}
							control={form.control}
							name="phone"
							label="Phone Number"
							placeholder="0412 345 678"
						/>
					</div>

					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							fieldType={FormFieldType.DATE_PICKER}
							control={form.control}
							name="birthDate"
							label="Date of Birth"
						/>

						<CustomFormField
							fieldType={FormFieldType.SKELETON}
							control={form.control}
							name="gender"
							label="Gender"
							renderSkeleton={(field) => (
								<FormControl>
									<RadioGroup
										className="flex h-11 gap-6 xl:justify-between"
										onValueChange={field.onChange}
										defaultValue={field.value}>
										{GenderOptions.map((option) => (
											<div
												key={option}
												className="radio-group">
												<RadioGroupItem
													value={option}
													id={option}
												/>
												<Label
													htmlFor={option}
													className="cursor-pointer">
													{option}
												</Label>
											</div>
										))}
									</RadioGroup>
								</FormControl>
							)}
						/>
					</div>

					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							fieldType={FormFieldType.INPUT}
							control={form.control}
							name="address"
							label="Address"
							placeholder="7th Avenue, New-York"
						/>
						<CustomFormField
							fieldType={FormFieldType.INPUT}
							control={form.control}
							name="occupation"
							label="Occupation"
							placeholder="Software Engineer"
						/>
					</div>

					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							fieldType={FormFieldType.INPUT}
							control={form.control}
							name="emergencyContactName"
							label="Emergency Contact Name"
							placeholder="Emergency Contact"
						/>

						<CustomFormField
							fieldType={FormFieldType.PHONE_INPUT}
							control={form.control}
							name="emergencyContactNumber"
							label="Emergency Contact Phone Number"
							placeholder="0412 345 678"
						/>
					</div>
				</section>

				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<h2 className="sub-header">Medical Informations</h2>
					</div>

					<CustomFormField
						fieldType={FormFieldType.SELECT}
						control={form.control}
						name="primaryPhysician"
						label="Primary Physician"
						placeholder="Select a physician">
						{Doctors.map((doctor, i) => (
							<SelectItem
								key={doctor.name + i}
								value={doctor.name}>
								<div className="flex cursor-pointer items-center gap-2">
									<Image
										src={doctor.image}
										width={32}
										height={32}
										alt={doctor.name}
										className="rounded-full border border-dark-500"
									/>
									<p>{doctor.name}</p>
								</div>
							</SelectItem>
						))}
					</CustomFormField>

					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							fieldType={FormFieldType.INPUT}
							control={form.control}
							name="insuranceProvider"
							label="Insurance Provider"
							placeholder="Bupa,  Medibank,  Allianz, etc... "
						/>
						<CustomFormField
							fieldType={FormFieldType.INPUT}
							control={form.control}
							name="insurancePolicyNumber"
							label="Insurance Policy Number"
							placeholder="ABC123456789"
						/>
					</div>

					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							fieldType={FormFieldType.TEXTAREA}
							control={form.control}
							name="allergies"
							label="Allergies (if any)"
							placeholder="Peanuts, Penicillin, pollen"
						/>
						<CustomFormField
							fieldType={FormFieldType.TEXTAREA}
							control={form.control}
							name="currentMedication"
							label="Current Medication (if any)"
							placeholder="Paracetamol 500mg, Ibuprofen 200mg"
						/>
					</div>

					<div className="flex flex-col gap-6 xl:flex-row">
						<CustomFormField
							fieldType={FormFieldType.TEXTAREA}
							control={form.control}
							name="familyMedicalHistory"
							label="Family Medical History"
							placeholder="Mother had brain cancer, Father had heart disease"
						/>
						<CustomFormField
							fieldType={FormFieldType.TEXTAREA}
							control={form.control}
							name="pastMedicalHistory"
							label="Past Medical History"
							placeholder="Appendectomy, Low blood pressure "
						/>
					</div>
				</section>

				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<h2 className="sub-header">
							Identification and Verification
						</h2>
					</div>

					<CustomFormField
						fieldType={FormFieldType.SELECT}
						control={form.control}
						name="identificationType"
						label="Identification Type"
						placeholder="Select an identification type">
						{IdentificationTypes.map((type) => (
							<SelectItem
								key={type}
								value={type}
								className="cursor-pointer">
								{type}
							</SelectItem>
						))}
					</CustomFormField>

					<CustomFormField
						fieldType={FormFieldType.INPUT}
						control={form.control}
						name="identificationNumber"
						label="Identification Number"
						placeholder="123456789"
					/>

					<CustomFormField
						fieldType={FormFieldType.SKELETON}
						control={form.control}
						name="identificationDocument"
						label="Upload a copy of your document"
						renderSkeleton={(field) => (
							<FormControl>
								<FileUploader
									files={field.value}
									onChange={(files) => {
										field.onChange;
										console.log(files);
									}}
								/>
							</FormControl>
						)}
					/>
				</section>
				<section className="space-y-6">
					<div className="mb-9 space-y-1">
						<h2 className="sub-header">Consent and Privacy</h2>
					</div>
					<CustomFormField
						fieldType={FormFieldType.CHECKBOX}
						control={form.control}
						name="treatmentConsent"
						label="I consent to treatment"
					/>
					<CustomFormField
						fieldType={FormFieldType.CHECKBOX}
						control={form.control}
						name="disclosureConsent"
						label="I consent to disclosure of informations"
					/>
					<CustomFormField
						fieldType={FormFieldType.CHECKBOX}
						control={form.control}
						name="privacyConsent"
						label="I consent to privacy policy"
					/>
				</section>
				<SubmitButton isLoading={isLoading}>
					Get Started
				</SubmitButton>
			</form>
		</Form>
	);
};

export default RegisterForm;
