"""Regression checks for the installer's existing-file preservation boundary."""

import tempfile
import unittest
from contextlib import redirect_stdout
from io import StringIO
from pathlib import Path

from buildr_stack import KitError, check, install, installation_files


class PreservationTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)

    def run_install(self, target, files, **kwargs):
        with redirect_stdout(StringIO()):
            return install(target, files, **kwargs)

    def test_conflict_preserves_existing_and_writes_nothing_else(self):
        target = self.root / "existing"
        target.mkdir()
        (target / "PROJECT.md").write_bytes(b"owner's work")
        with self.assertRaises(KitError):
            self.run_install(target, installation_files("Example", "build", False))
        self.assertEqual((target / "PROJECT.md").read_bytes(), b"owner's work")
        self.assertEqual(list(target.iterdir()), [target / "PROJECT.md"])

    def test_symlink_parent_is_rejected_before_any_write(self):
        target = self.root / "project"
        outside = self.root / "outside"
        target.mkdir()
        outside.mkdir()
        try:
            (target / ".agents").symlink_to(outside, target_is_directory=True)
        except OSError:
            self.skipTest("OS has not granted symlink creation permission")
        with self.assertRaises(KitError):
            self.run_install(target, installation_files("Example", "build", False))
        self.assertEqual(list(outside.iterdir()), [])
        self.assertEqual(len(list(target.iterdir())), 1)

    def test_dry_run_does_not_create_target(self):
        target = self.root / "new"
        self.run_install(target, installation_files("Example", "build", False), dry_run=True)
        self.assertFalse(target.exists())

    def test_repeat_install_preserves_file_modification_times(self):
        target = self.root / "path with spaces"
        files = installation_files("Small project", "pair", False)
        self.run_install(target, files)
        times = {name: (target / name).stat().st_mtime_ns for name in files}
        self.assertEqual(self.run_install(target, files), (0, len(files)))
        self.assertEqual(times, {name: (target / name).stat().st_mtime_ns for name in files})
        self.assertEqual(check(target), [])

    def test_skills_only_preserves_existing_documents(self):
        target = self.root / "existing"
        target.mkdir()
        (target / "AGENTS.md").write_bytes(b"existing project rules")
        self.run_install(target, installation_files("Example", "build", True))
        self.assertEqual((target / "AGENTS.md").read_bytes(), b"existing project rules")
        self.assertFalse((target / "PROJECT.md").exists())
        self.assertTrue((target / ".agents/skills/buildr-start/SKILL.md").is_file())
        self.assertEqual(check(target), [])


if __name__ == "__main__":
    unittest.main()
