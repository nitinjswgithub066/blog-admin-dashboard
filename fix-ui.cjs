const fs = require('fs');

function fix(file, replaces) {
  let c = fs.readFileSync(file, 'utf8');
  replaces.forEach(r => { c = c.replace(r[0], r[1]) });
  fs.writeFileSync(file, c);
}

fix('src/utils/cn.ts', [
  ['(...classes: (string | undefined | null | false)[])', '(...classes: any[])']
]);

fix('src/components/ui/Input/Input.tsx', [
  ["import React, { InputHTMLAttributes, forwardRef } from 'react';", "import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';"],
  [/React\.ReactNode/g, "ReactNode"]
]);

fix('src/components/ui/Textarea/Textarea.tsx', [
  ["import React, { TextareaHTMLAttributes, forwardRef } from 'react';", "import { forwardRef, type TextareaHTMLAttributes } from 'react';"]
]);

fix('src/components/ui/Select/Select.tsx', [
  ["import React, { SelectHTMLAttributes, forwardRef } from 'react';", "import { forwardRef, type SelectHTMLAttributes } from 'react';"]
]);
