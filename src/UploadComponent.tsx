import { Upload, XCircle } from "lucide-react";
import { type ChangeEvent, type FormEvent, useState } from "react";

interface FormData {
	name: string;
	description: string;
	image: File | null;
}

export default function UploadComponent() {
	const [formData, setFormData] = useState<FormData>({
		name: "",
		description: "",
		image: null,
	});
	const [imagePreview, setImagePreview] = useState<string | null>(null);

	const handleInputChange = (
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setFormData((prev) => ({ ...prev, image: file }));
			setImagePreview(URL.createObjectURL(file));
		}
	};

	const clearImage = () => {
		setImagePreview(null);
		setFormData((prev) => ({ ...prev, image: null }));
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		if (!formData.image) {
			alert("Please select an image");
			return;
		}

		const form = new FormData();
		form.append("file", formData.image);
		form.append("name", formData.name);
		form.append("description", formData.description);

		try {
			const response = await fetch("https://uploads.pinata.cloud/v3/files", {
				method: "POST",
				headers: {
					Authorization:
						"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1OTVmNGMwYi05MzhjLTQ2ZDQtOGMyNS1lNGY5MzYwNzE1OTAiLCJlbWFpbCI6ImFybXN2ZXNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjE2M2M4MzJhZmYzYTliN2Q3YmFlIiwic2NvcGVkS2V5U2VjcmV0IjoiYjE4ODhmMDViN2M5YTZlZTEzMmUxZTcwMWUwZWJjZjk5ZTk3YjIwYjMyMDZkNDBhOGZiZGM4ZmQ4NTdlNmVmNyIsImV4cCI6MTc2MTUzNjQ1Mn0.ipJyOItQt4ok9RMxSbhwoKLN_GPU8QX2UVTIoUftJ8w",
				},
				body: form,
			});
			const result = await response.json();
			alert(`File uploaded! CID: ${result.data.cid}`);
		} catch (error) {
			console.error("Upload failed:", error);
			alert("Upload failed");
		}
	};

	return (
		<div className="container">
			<h1>Upload to IPFS</h1>

			<div className="card">
				<form onSubmit={handleSubmit}>
					<div className="input-group">
						<input
							type="text"
							name="name"
							placeholder="Name"
							value={formData.name}
							onChange={handleInputChange}
						/>
					</div>

					<div className="input-group">
						<textarea
							name="description"
							placeholder="Description"
							value={formData.description}
							onChange={handleInputChange}
							className="input"
							style={{ width: "100%", minHeight: "100px" }}
						/>
					</div>

					<div className="card" style={{ marginTop: "1rem" }}>
						<input
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							className="hidden"
							id="image-upload"
						/>
						<label htmlFor="image-upload" className="cursor-pointer block">
							{imagePreview ? (
								<div className="relative">
									<img
										src={imagePreview}
										alt="Preview"
										className="max-h-48 mx-auto"
									/>
									<button
										type="button"
										onClick={clearImage}
										className="absolute top-2 right-2 p-1"
									>
										<XCircle className="h-6 w-6" />
									</button>
								</div>
							) : (
								<div className="flex flex-col items-center p-6">
									<Upload className="h-12 w-12 mb-2" />
									<p>Click or drag to upload image</p>
								</div>
							)}
						</label>
					</div>

					<div className="button-group" style={{ marginTop: "1rem" }}>
						<button type="submit" className="btn-create">
							Upload
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}