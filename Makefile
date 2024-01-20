PREPROC := python3 pp.py

src_dir   := src
build_dir := build

js_files := $(subst $(src_dir)/,,$(wildcard $(src_dir)/*.user.js))

build_js_files := $(foreach f,$(js_files),$(build_dir)/$(f))

all: $(build_dir) $(build_js_files)

$(build_dir):
	@if [ ! -x $(build_dir) ];      \
  then                                  \
    mkdir -p $(build_dir);              \
  fi

$(build_dir)/%.user.js: $(src_dir)/%.user.js
	$(PREPROC) $< > $@

PHONY: clean
clean:
	rm -fr $(build_dir) \
	pp.pyc
