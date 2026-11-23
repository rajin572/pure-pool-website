/* eslint-disable @typescript-eslint/no-explicit-any */
import { toast } from "sonner";

interface TryCatchWrapperOptions {
  body?: any;
  params?: any;
}

interface TryCatchConfig {
  showToast?: boolean;
  setLoading?: (loading: boolean) => void;
  setError?: (error: string | null) => void;
  toastLoadingMessage?: string;
  toastSuccessMessage?: string;
  toastErrorMessage?: string;
}

const tryCatchWrapper = async (
  asyncFunction: any,
  reqData?: TryCatchWrapperOptions,
  config: TryCatchConfig = {
    showToast: true,
  },
) => {
  const {
    showToast = true,
    setLoading,
    setError,
    toastLoadingMessage = "Processing...",
    toastSuccessMessage,
    toastErrorMessage = "Something went wrong! Please try again.",
  } = config;

  // Set loading state
  setLoading?.(true);

  // Show loading toast only if showToast is true
  const toastId = showToast
    ? toast.loading(toastLoadingMessage, {
        duration: 2000,
      })
    : undefined;

  try {
    // Build request object
    let req: any = {};

    if (reqData?.body && reqData?.params) {
      req = { body: reqData.body, params: reqData.params };
    } else if (reqData?.body) {
      req = { body: reqData.body };
    } else if (reqData?.params) {
      req = { params: reqData.params };
    }

    const res = await asyncFunction(req);

    // Backend envelope: { success: true, data, meta? } | { success: false, error: { code, message } }
    if (!res.success) {
      const failure: Error & { code?: string } = new Error(res.error?.message || res.message);
      failure.code = res.error?.code;
      throw failure;
    } else {
      // Success responses carry no message, so fall back to the caller's text or a generic one.
      if (showToast) {
        toast.success(toastSuccessMessage || res.message || "Done", {
          id: toastId,
          duration: 2000,
        });
      }
    }

    setLoading?.(false);
    setError?.(null);
    return res;
  } catch (error: any) {
    console.log(error);

    const errorMessage: string =
      error?.data?.error?.message ||
      error?.data?.message ||
      error?.message ||
      error?.error ||
      "";
    const errorCode: string | undefined = error?.code ?? error?.data?.error?.code;

    let displayError = toastErrorMessage;

    // Check if error is related to file size/body limit
    if (
      errorMessage.toLowerCase().includes("body size") ||
      errorMessage.toLowerCase().includes("exceeded") ||
      errorMessage.toLowerCase().includes("10mb") ||
      errorMessage.toLowerCase().includes("body limit") ||
      errorMessage.toLowerCase().includes("unexpected end of form") ||
      errorMessage.toLowerCase().includes("too large")
    ) {
      displayError =
        "File size exceeded! Maximum upload size is 500MB. Please upload smaller files.";
    } else if (errorMessage) {
      displayError = errorMessage;
    }

    // Show error toast only if showToast is true
    setError?.(displayError);

    if (showToast) {
      toast.error(displayError, {
        id: toastId,
        duration: 3000, // Increased duration for file size errors
      });
    }

    setLoading?.(false);
    return { success: false, message: displayError, code: errorCode };
  }
};

export default tryCatchWrapper;
