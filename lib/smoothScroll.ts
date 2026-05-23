export function smoothScrollTo(targetId: string) {
  const target = document.getElementById(targetId)
  if (!target) return
  const top = target.getBoundingClientRect().top + window.scrollY - 56
  window.scrollTo({ top, behavior: "smooth" })
}
