import os
def replace_in_file(filepath, old_text, new_text):
    with open(filepath, 'r') as f:
        content = f.read()
    new_content = content.replace(old_text, new_text)
    with open(filepath, 'w') as f:
        f.write(new_content)

cpc_path = '/data/gdev/projects/OuterGazers/outergazers-web/src/components/ui/CarouselProjectCard.tsx'
cpc_old = '''          {link && (
            <div className="pointer-events-auto w-fit">
              <Link
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn relative px-8 py-3 md:px-10 md:py-4 overflow-hidden font-bold text-[10px] md:text-xs uppercase tracking-[0.25em] transition-all duration-500 inline-block bg-[#00b4d8]/10 border border-[#00b4d8]/50 hover:border-[#00b4d8] backdrop-blur-md text-white"
              >
                <span className="relative z-10">View Experience</span>
                <div className="absolute inset-0 bg-[#00b4d8] translate-x-[-101%] group-hover/btn:translate-x-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10 group-hover/btn:text-[#0a0a0a] transition-colors duration-500 block absolute inset-0 flex items-center justify-center opacity-0 group-hover/btn:opacity-100">
                  View Experience
                </span>
              </Link>
            </div>
          )}'''
replace_in_file(cpc_path, cpc_old, '')

sc_path = '/data/gdev/projects/OuterGazers/outergazers-web/src/components/ui/SpatialCarousel.tsx'
sc_old1 = '''            {/* Link button */}
            {item.link && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.45 }}
              >
                <Link
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/btn relative inline-flex items-center gap-3 px-8 py-3 lg:px-10 lg:py-4 overflow-hidden font-bold text-[10px] lg:text-xs uppercase tracking-[0.25em] border border-[#00b4d8]/50 hover:border-[#00b4d8] backdrop-blur-md text-white transition-all duration-500"
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="relative z-10 group-hover/btn:text-[#0a0a0a] transition-colors duration-500">
                    View Experience
                  </span>
                  <svg className="relative z-10 w-4 h-4 text-current group-hover/btn:text-[#0a0a0a] transition-colors duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                  <div className="absolute inset-0 bg-[#00b4d8] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out" />
                </Link>
              </motion.div>
            )}'''
replace_in_file(sc_path, sc_old1, '')

sc_old2 = '''            {item.link && (
              <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#00b4d8] hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                View Experience
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </Link>
            )}'''
replace_in_file(sc_path, sc_old2, '')

print("Replaced!")
