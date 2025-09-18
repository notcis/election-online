"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";

export default function SearchText({
  query,
  placeholder,
}: {
  query: string;
  placeholder: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [queryValue, setQueryValue] = useState(searchParams.get(query) ?? "");

  useEffect(() => {
    setQueryValue(searchParams.get(query) || "");
  }, [searchParams, query]);
  return (
    <form action={pathname} method="GET" className="flex gap-2">
      <Input
        name={query}
        type="search"
        placeholder={placeholder}
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className="w-72"
      />
      <Button type="submit">ค้นหา</Button>
      <Button variant="outline" asChild>
        <Link href={pathname}>ล้าง</Link>
      </Button>
    </form>
  );
}
