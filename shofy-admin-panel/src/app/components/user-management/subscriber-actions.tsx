"use client";
import React from "react";
import Swal from "sweetalert2";
import { useUnsubscribeMutation } from "@/redux/user-management/userManagementApi";
import { notifySuccess, notifyError } from "@/utils/toast";
import { ISubscriber } from "@/types/user-management-type";

interface SubscriberActionsProps {
  subscriber: ISubscriber;
}

const SubscriberActions = ({ subscriber }: SubscriberActionsProps) => {
  const [unsubscribe] = useUnsubscribeMutation();

  const handleUnsubscribe = async () => {
    if (subscriber.status === "unsubscribed") {
      return notifyError("Email is already unsubscribed");
    }

    Swal.fire({
      title: "Unsubscribe?",
      text: `Unsubscribe ${subscriber.email} from newsletter?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, unsubscribe!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await unsubscribe({ email: subscriber.email });
          
          if ("error" in res) {
            if ("data" in res.error) {
              const errorData = res.error.data as { message?: string };
              if (typeof errorData.message === "string") {
                return notifyError(errorData.message);
              }
            }
            notifyError("Failed to unsubscribe");
          } else {
            notifySuccess(res.data?.message || "Unsubscribed successfully");
          }
        } catch (error) {
          notifyError("Failed to unsubscribe");
        }
      }
    });
  };

  return (
    <div className="flex items-center justify-end space-x-2">
      {subscriber.status === "active" ? (
        <button
          onClick={handleUnsubscribe}
          className="w-auto px-4 h-10 leading-10 text-tiny bg-red-500 text-white rounded-md hover:bg-red-600"
        >
          Unsubscribe
        </button>
      ) : (
        <span className="text-sm text-gray-500">Unsubscribed</span>
      )}
    </div>
  );
};

export default SubscriberActions;
