import ChangePasswordDialog from "@/features/auth/components/ChangePasswordDialog";

const ChangePassword = ({ open, setOpen }) => {
  return <ChangePasswordDialog open={open} setOpen={setOpen} />;
};

export default ChangePassword;
