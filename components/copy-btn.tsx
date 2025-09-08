import { formatHex } from "@/lib/gel/formatHex";
import { toCmyk } from "@/lib/gel/toCmyk";
import { toHsl } from "@/lib/gel/toHsl";
import { toRgb } from "@/lib/gel/toRgb";
import { ScriptCopyBtn } from "./ui/script-copy-btn";

interface copyBtnInputs {
  color: string;
}

export default function CopyBtn({ color }: copyBtnInputs) {
  const customCommandMap = {
    hex: formatHex(color),
    hsl: toHsl(color),
    cmyk: toCmyk(color),
    rgb: toRgb(color),
  };
  return (
    <>
      <ScriptCopyBtn
        showMultiplePackageOptions={true}
        codeLanguage="shell"
        lightTheme="nord"
        darkTheme="andromeeda"
        commandMap={customCommandMap}
      />
    </>
  );
}
