/**
 * Create form data from files
 * @param files files to upload
 * @returns form data
 */
export function createFormData(files: File[]): FormData {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("file", file);
  });
  return formData;
}
