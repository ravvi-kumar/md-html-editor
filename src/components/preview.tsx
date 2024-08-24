function Preview({ sanitizedHTML }: { sanitizedHTML: string }) {
  return (
    <>
      <div
        className="preview"
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      />
    </>
  );
}

export default Preview;
